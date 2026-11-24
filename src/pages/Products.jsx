import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import CategoryList from "../components/CategoryList.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import styles from "./Products.module.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip,setSkip] = useState(0);
  const [more,setMore] = useState(true)
  const limit = 30;

 
    async function getData() {
      try {
        setIsLoading(true);
        const productData = await fetchJson(
         `/products?limit=${limit}&skip=${skip}`
        );

        setProducts((prevProducts) => {
          const existingIds = new Set(prevProducts.map((p) => p.id));

         const newProducts = productData.products.filter(
        (product) => !existingIds.has(product.id)
      );
        return[...prevProducts,...newProducts]
      });
      
        setTotal(productData.total);
         setSkip(skip + productData.products.length);
        setMore(skip + productData.products.length < productData.total);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }

}
   useEffect(() => {
    async function getInitialData() {
      try {
        const categoryData = await fetchJson("/products/categories");
        setCategories(categoryData);

        await getData();
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    getInitialData();
  }, []);

  if (isLoading && products.length === 0) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <section>
      <h1 className="page-title">Alla produkter</h1>

      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Sök produkter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <p className={styles.count}>
          Visar {products.length} av {total} produkter
        </p>
      </div>

      <div className={styles.categories}>
        <CategoryList categories={categories} />
      </div>

      <ProductGrid products={products} />
      
      {more && (
      <button className={styles.btn} onClick={getData} disabled={isLoading}> 
            {isLoading ? "laddar ..." : "Visa fler "}
            </button>
          )}
    </section>
  );
}

export default Products;
