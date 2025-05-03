import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      {/* 
        Ví dụ này yêu cầu cập nhật template của bạn:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Không tìm thấy trang
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to={`/signin`}>
              <button className="btn btn-primary">Quay lại đăng nhập</button>
            </Link>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Liên hệ hỗ trợ <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default PageNotFound;
