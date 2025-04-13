import React, { useEffect, useState } from "react";
import "./Blog.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import blogThumbnail from "./assets/blogs.png";
import stack from "./assets/Stack.svg";
import user from "./assets/UserCircle.svg";
import calender from "./assets/CalendarBlank.svg";
// import chat from "./assets/ChatCircleDots.svg";
// import author from "./assets/author.png";
// import whatsapp from "./assets/whatsapp.png";
// import facebook from "./assets/facebook.png";
// import twitter from "./assets/twitter.png";
// import linkedin from "./assets/linkedin.png";
// import pinterest from "./assets/pinterest.png";
// import link from "./assets/link.png";
// import quote from "./assets/quote.png";
// import car1 from "./assets/car1.png";
// import car2 from "./assets/car2.png";
// import comment1 from "./assets/comment1.png";
// import copyLink from "../../assets/copyLink.png";
import SinginPopup from "@components/signInPopup/index";
// import { usePopup } from "@components/DataContext";
// import commentCar1 from "./assets/comment-car1.png";
// import commentCar2 from "./assets/comment-car2.png";
// import commentCar3 from "./assets/comment-car3.png";
// import { toast } from "react-toastify";
import { fixUrl, formatDate } from "../../helpers/helpers";
import POSTS from "../../client/postsClient";
import POST_ATTRIBUTES from '@client/postAttributesClient';

const Blog = ({ ids, limit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blogdate, setblogdate] = useState("");
  const [searchInput, setsearchInput] = useState("");
  const [categories, setcategories] = useState([]);
  const [blog, setblog] = useState({});
  const [blogs, setblogs] = useState([]);
  const [loadingBlogs, setloadingBlogs] = useState(false)
  // const { showPopup, setopenSigninPopup } = usePopup();
  // const [Comments, setComments] = useState([]);
  // const [commentsLength, setcommentsLength] = useState(3);
  // const popularTags = ["Game", "iPhone", "TV", "Asus Laptops", "Macbook ", "SSD", "Cars", "Speaker", "Tablet", "Glasses", "Samsung", "Power Bank "];
  // const [Comment, setComment] = useState({});

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchBlog = async () => {
    const { data, error } = await POSTS.getPost(id, {
      with: "thumbnail,rating"
    });
    if (data) {
      setblog(data.post);
      setblogdate(formatDate(data.post.created_at));
    }
    if (error) {
      console.error(data);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchBlogs = async () => {
    setloadingBlogs(true);

    const ApiParams = {
      ids: ids,
      with: 'thumbnail',
      search: searchInput,
      per_page: 3,
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'post_type',
            value: 'blogs',
            operator: '=',
          }
        ]
      },
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) {
      setblogs(data.posts.data);
    }

    if (error) {
      console.error(error);
      setblogs([]);
    }

    setloadingBlogs(false);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await POST_ATTRIBUTES.getPostAttribute('categories');
    if (data) setcategories(data.post_attribute.attribute_items.post_attribute_items);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const handleChange = (e) => {
  //   setComment({ ...Comment, [e.target.name]: e.target.value });
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("full_name", Comment.fullName);
  //   formData.append("user_id", Comment.user_id);
  //   formData.append("message", Comment.comment);
  //   try {
  //     const response = await axiosClient.post(`${import.meta.env.VITE_ADMIN_API_ENDPOINT}/posts/${id}/comment/insert`, formData);
  //     if (response.status == 200) {
  //       toast.error(response.data.message);
  //     } else {
  //       console.error(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error updating the job:", error.response);
  //     toast.error("Error!")
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const copyLinkToClipboard = async (text) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     toast.success('Copied to clipboard!');

  //   } catch (error) {
  //     toast.error('Failed to copy:', error);
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const renderMoreReviews = () => {
  //   if (commentsLength >= Comments.length) return
  //   setcommentsLength(commentsLength + 1)
  // }

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchComments = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_ADMIN_API_ENDPOINT}/blogs/${id}/comments`);
  //     setComments(response.data)
  //   } catch (error) {
  //     toast.error("Error Fetching Comments")
  //   }
  // }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchBlog();
  }, [id]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchBlogs();
  }, [id, searchInput]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories();
    // fetchComments()
  }, [id]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className="wrapper SingleBlog">
      <SinginPopup />
      <div className="blog-title">
        <h1>
          <Link to={'/'}>Home</Link> / <Link to={'/blogs'}>Blogs</Link> / <span>Blog Details</span>
        </h1>
      </div>
      <div className="blog-image">
        <img src={fixUrl(blog?.thumbnail?.media?.url) ?? blogThumbnail} alt="" />
      </div>
      <div className="blog-container">
        <div className="blog-left">
          <div className="blog-details">
            <div className="stack">
              <img src={stack} alt="" />
              <h2>{blog?.categories?.post_attribute_items[0]?.attribute_item?.post_attribute_item?.name ?? 'UnCategorized'}</h2>
            </div>
            <div className="name">
              <img src={user} alt="" />
              <h2>{blog?.shop?.shop?.name}</h2>
            </div>
            <div className="date">
              <img src={calender} alt="" />
              <h2>{blogdate}</h2>
            </div>
            {/* <div className="comments">
              <img src={chat} alt="" />
              <h2>738</h2>
            </div> */}
          </div>
          <div className="heading">
            <h1>{blog.name}</h1>
          </div>
          <div className="author">
            <div className="author-name">
              {blog?.shop?.shop?.thumbnail?.media?.url
                ?
                <img src={fixUrl(blog?.shop?.shop?.thumbnail?.media?.url)} alt="" />
                :
                <div className="author-gravatar">{blog?.shop?.shop?.name.charAt(0)}</div>
              }
              <h2>{blog?.shop?.shop?.name}</h2>
            </div>
            {/* <div className={`author-social`}> */}
            {/* <div className="shareButtons"> */}
            {/* <Link target="_blank" to={"https://www.wa.me/"}><img src={whatsapp} alt="" /></Link>
              <Link target="_blank" to={"https://www.facebook.com"}><img src={facebook} alt="" /></Link>
              <Link target="_blank" to={"https://www.twitter.com"}><img src={twitter} alt="" /></Link>
              <Link target="_blank" to={"https://www.linkedin.com"}><img src={linkedin} alt="" /></Link>
              <Link target="_blank" to={"https://www.pinterest.com"}><img src={pinterest} alt="" /></Link>
              <Link onClick={() => copyLinkToClipboard(window.location.href)} ><img src={copyLink} alt="" /></Link> */}
            {/* </div> */}
            {/* </div> */}
          </div>
          <div className="blog-content">
            <div className="paragraph">
              <p dangerouslySetInnerHTML={{ __html: blog.description }} />
            </div>
            {/* <div className="quote">
              <img src={quote} alt="" />
              <p>Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            </div>
            <div className="paragraph">
              <p>
                Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. <br /> <br />
                Borem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
              </p>
            </div> */}
            {/* <div className="content-images">
              <img src={car1} alt="" />
              <img src={car2} alt="" />
            </div>
            <div className="paragraph">
              <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.</p>
            </div> */}
            {/* <div className="add-comment-section">
              <h2>Leave a Comment</h2>
              <p>Nunc velit metus, volutpat elementum euismod eget, cursus nec nunc.</p>
              <div className="comment-box">
                <div className="name-email">
                  <input type="text" name="fullName" onChange={() => handleChange(event)} placeholder="Enter Full Name" />
                  <input type="text" name="email" onChange={() => handleChange(event)} placeholder="Enter Your Email Address" />
                </div>
                <textarea name="comment" id="" onChange={() => handleChange(event)} placeholder="Enter Your Message" cols="30" rows="10"></textarea>
                <button onClick={() => handleSubmit(event)}>POST COMMENTS</button>
              </div>
            </div> */}
            {/* <div className="comment-section">
              <h1 className="heading">Comments</h1>
              <div className="comments-div">
                {Comments?.slice(0, commentsLength).map((comment, index) => (<div className="comment">
                  <div className="comment-top">
                    <div className="comment-name">
                      <img src={comment.userImg} alt="" />
                      <h2>{comment.name}</h2>
                      <h3>{comment.date}</h3>
                    </div>
                    <div className="comment-review">
                      <div className="review">
                        {Array.from({ length: comment.ratings }, (_, index) => index + 1).map(e => (<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0.742188 9.33325C1.55615 8.26655 2.78663 8.28904 3.92809 8.09305C5.42247 7.83923 7.23163 8.03843 8.32857 7.23519C9.42233 6.42875 9.80706 4.6295 10.497 3.26078C10.7291 2.80455 10.8563 2.24871 11.1933 1.90492C11.6353 1.46154 12.2426 0.90891 12.7767 0.912123C13.3109 0.912123 14.0486 1.41656 14.3379 1.91456C15.2123 3.42143 15.8673 5.06003 16.713 6.58618C16.9515 7.01671 17.5143 7.42476 17.9944 7.52436C19.6477 7.86172 21.352 7.97096 22.9926 8.3533C23.6349 8.50431 24.4425 9.04408 24.6523 9.60635C24.8336 10.0915 24.4329 11.004 24.0164 11.4763C22.8909 12.7486 21.5777 13.8474 20.4299 15.1037C20.0961 15.4668 19.883 16.1415 19.9403 16.6331C20.1247 18.2427 20.5507 19.8299 20.697 21.4428C20.7606 22.1657 20.5857 23.1071 20.1501 23.6308C19.5174 24.3955 18.608 23.9553 17.8322 23.5377C16.4173 22.773 15.0151 21.973 13.5557 21.3047C13.1106 21.1023 12.4206 21.1087 11.9755 21.3175C10.443 22.034 9.00581 22.9561 7.46056 23.6405C6.88506 23.8943 5.94392 23.9714 5.4956 23.6533C5.05047 23.3385 4.78974 22.4067 4.84697 21.7834C4.99641 20.0838 5.29529 18.3905 5.66094 16.723C5.83899 15.9198 5.58781 15.4668 5.05364 14.9495C3.5847 13.5358 2.17298 12.0675 0.742188 10.6184C0.742188 10.1911 0.742188 9.76057 0.742188 9.33325Z"
                            fill="#FFB800"
                          />
                        </svg>))}
                      </div>
                      <h3 className="review-count">({comment.ratings})</h3>
                    </div>
                  </div>
                  <div className="comment-bottom">
                    <div className="images">
                      {
                        comment.images.map((img) => (
                          <img src={img} alt="" />
                        ))
                      }
                    </div>
                    <div className="paragraph">
                      <p>{comment.commentText} </p>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              <button onClick={renderMoreReviews}>See More Reviews</button>
            </div> */}
          </div>
        </div>
        <div className="blog-right">
          <div className="search">
            <h2>Search</h2>
            <div className="input">
              <input type="text" placeholder="Search..." onChange={(e) => setsearchInput(e.target.value)} />
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.798 21.8098C17.6943 21.8098 21.6635 17.8406 21.6635 12.9444C21.6635 8.04817 17.6943 4.07898 12.798 4.07898C7.9018 4.07898 3.93262 8.04817 3.93262 12.9444C3.93262 17.8406 7.9018 21.8098 12.798 21.8098Z" stroke="#191C1F" strokeWidth="2.02638" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.0674 19.2135L24.1967 24.3428" stroke="#191C1F" strokeWidth="2.02638" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="shop-category">
            <div className="shop-category-inner">
              <p>CATEGORIES</p>
              <div className="shop-category-container">
                {categories.map((e, i) => {
                  return (
                    <div key={i}>
                      <Link to={`/blogs?category=${e?.id}`}>
                        <label htmlFor={e?.id}>{e?.name}</label>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="latest-blogs">
            <div className="latest-blogs-contain">
              <div className="latest-blogs-top">
                <h2>LATEST BLOGS</h2>
              </div>
              <div className="latest-blogs-container">
                {loadingBlogs ?
                  ('Fetching...')
                  :
                  (blogs?.length > 0 ?
                    blogs?.map((e, index) => (
                      (<div key={index} className="latest-blog">
                        <img style={{ cursor: 'pointer' }} onClick={() => navigate(`/blogs/${e?.id}`)} src={fixUrl(e?.thumbnail?.media?.url)} alt="" />
                        <div className="latest-blog-content">
                          <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/blogs/${e?.id}`)}>{e?.name}</h3>
                          <p>{formatDate(e?.created_at)}</p>
                        </div>
                      </div>)
                    ))
                    :
                    "No blogs found!"
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
