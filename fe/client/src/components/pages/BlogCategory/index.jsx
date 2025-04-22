// /* eslint-disable react/no-children-prop */
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import BlogCard from '../../molecules/BlogCard';
// import Empty from '../../organisms/Empty';
// import ContainerWapper from '../../templates/ContainerWapper';
// import MainTemplate from '../../templates/MainTemplate';

// const BlogCategory = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBlogs = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/blogs');
//                 setBlogs(response.data);
//             } catch (error) {
//                 console.error('Lỗi khi lấy dữ liệu blogs:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBlogs();
//     }, []);

//     return (
//         <MainTemplate>
//             <ContainerWapper>
//                 <div className="w-full py-[100px]">
//                     {loading ? (
//                         <p className="text-center text-lg">Đang tải dữ liệu...</p>
//                     ) : blogs?.length ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px]">
//                             {blogs.map((item) => (
//                                 <BlogCard key={item.id} data={item} />
//                             ))}
//                         </div>
//                     ) : (
//                         <Empty />
//                     )}
//                 </div>
//             </ContainerWapper>
//         </MainTemplate>
//     );
// };

// export default BlogCategory;
