import Home from "../../pages/Home";
import Product from "../../pages/Product/Product";
import Categories from "../../pages/Category";

export const privateRoutes = [
  {
    key: "home",
    path: "/home",
    element: <Home />,
  },
  {
    key: "category",
    path: "/category",
    element: <Categories />,
  },
  {
    key: "product",
    path: "/product",
    element: <Product />,
  },
];