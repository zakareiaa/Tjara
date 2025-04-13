import React, { useState, useEffect } from 'react';

const ProductVariations = ({
    product,
    onVariationSelect,
    currentVariationProduct,
    setCurrentVariationProduct,
    setCanAddToCart,
    previewSwiper
}) => {
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [availableAttributeValues, setAvailableAttributeValues] = useState({});

    // Initialize available attributes and their values
    useEffect(() => {
        if (!product?.variations?.product_variations) return;

        const attributeMap = {};
        const variations = product.variations.product_variations;

        variations.forEach(variation => {
            variation.attributes.product_variation_attribute_items.forEach(attr => {
                const attrName = attr.attribute.name;
                if (!attributeMap[attrName]) {
                    attributeMap[attrName] = new Set();
                }
                attributeMap[attrName].add(JSON.stringify({
                    id: attr.attribute_item.id,
                    name: attr.attribute_item.name,
                    value: attr.attribute_item.value,
                    variationId: variation.id,
                    variationIndex: variations.indexOf(variation)
                }));
            });
        });

        // Convert Sets to arrays
        const processedAttributes = {};
        Object.entries(attributeMap).forEach(([key, value]) => {
            processedAttributes[key] = Array.from(value).map(item => JSON.parse(item));
        });

        setAvailableAttributeValues(processedAttributes);

        // Set initial variation if only one attribute type exists
        if (Object.keys(processedAttributes).length === 1) {
            const firstAttrName = Object.keys(processedAttributes)[0];
            const firstValue = processedAttributes[firstAttrName][0];
            updateAvailableCombinations(firstAttrName, firstValue);
        }
    }, [product]);

    // Find matching variation based on selected attributes
    const findMatchingVariation = (selections) => {
        const variations = product?.variations?.product_variations || [];

        return variations.find(variation => {
            return variation.attributes.product_variation_attribute_items.every(attr => {
                const attrName = attr.attribute.name;
                return selections[attrName]?.id === attr.attribute_item.id;
            });
        });
    };

    // Update available combinations when an attribute is selected
    const updateAvailableCombinations = (attributeName, selectedValue) => {
        const newSelections = {
            ...selectedAttributes,
            [attributeName]: selectedValue
        };
        setSelectedAttributes(newSelections);

        // Find the matching variation
        const matchingVariation = findMatchingVariation(newSelections);
        if (matchingVariation) {
            setCurrentVariationProduct(matchingVariation);
            setCanAddToCart(true);
            onVariationSelect(matchingVariation);

            // Calculate the slide index for the matching variation
            const baseImageCount = (product?.video?.media?.url ? 1 : 0) +
                (product?.thumbnail ? 1 : 0) +
                (product?.gallery?.length || 0);

            const variationIndex = product.variations.product_variations.indexOf(matchingVariation);
            const targetSlideIndex = baseImageCount + variationIndex;

            // Scroll to the variation image if swiper is available
            if (previewSwiper?.current?.swiper) {
                previewSwiper.current.swiper.slideTo(targetSlideIndex);
            }
        } else if (Object.keys(newSelections).length === Object.keys(availableAttributeValues).length) {
            // Only show "no variation" message if all attributes are selected
            setCurrentVariationProduct(null);
            setCanAddToCart(false);
        }
    };

    const handleAttributeClick = (attributeName, value) => {
        // If already selected, do nothing
        if (selectedAttributes[attributeName]?.id === value.id) return;

        updateAvailableCombinations(attributeName, value);
    };

    const renderAttributeSelector = (attributeName, values) => {
        const isColor = attributeName.toLowerCase() === 'colors';

        return (
            <div key={attributeName} className={`${isColor ? 'product-perview-color-box' : 'product-perview-size-box'}`}>
                <p className="product-perview-color-heading">{attributeName}:</p>
                <div className={`product-perview-color-variations`}>
                    {values.map((value) => {
                        const isSelected = selectedAttributes[attributeName]?.id === value.id;

                        if (isColor) {
                            return (
                                <div
                                    key={value.id}
                                    onClick={() => handleAttributeClick(attributeName, value)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <input
                                        type="radio"
                                        name={attributeName}
                                        className="color"
                                        style={{ background: value.value }}
                                        checked={isSelected}
                                        readOnly
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={value.id}
                                    onClick={() => handleAttributeClick(attributeName, value)}
                                    style={{
                                        cursor: 'pointer',
                                        opacity: 1
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={attributeName}
                                        checked={isSelected}
                                        readOnly
                                    />
                                    <label>{value.name}</label>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="variations-container">
            {Object.entries(availableAttributeValues).map(([attributeName, values]) =>
                renderAttributeSelector(attributeName, values)
            )}
        </div>
    );
};

export default ProductVariations;