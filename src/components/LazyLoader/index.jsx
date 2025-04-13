import { useEffect, useRef, useState } from "react";


function LazyLoader({ components }) {
  const ref = useRef()
  const [visibleIndex, setVisibleIndex] = useState(null);
  const componentRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting && visibleIndex === null) {
            setVisibleIndex(index);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 } // Adjust threshold as needed
    );

    componentRefs.current = Array(components.length)
      .fill()
      .map((_, index) => componentRefs.current[index] || ref);

    componentRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {components.map((component, index) => (
        <div key={index} ref={componentRefs.current[index]}>
          {visibleIndex === index && component}
        </div>
      ))}
    </div>
  );
}

export default LazyLoader