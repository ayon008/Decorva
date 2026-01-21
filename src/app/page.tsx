import Categories from "@/Shared/Home/Categories";
import Feature from "@/Shared/Home/Feature";
import Offers from "@/Shared/Home/Offers";
import Products from "@/Shared/Home/Products";
import Slider from "@/Shared/Home/Slider";
import Title from "@/Shared/Title/Title";

export default function Home() {
  return (
    <div>
      <Slider />
      <section className="lg:my-20 my-10">
        <Feature />
      </section>
      <Categories />
      <section className="lg:my-20 my-10">
        <Title title="Our Products" className="text-center" />
        <Products />
      </section>
      <section className="bg-[#F3F3F3] global-padding layout-container lg:py-20 py-10">
        <Title title="Today Deal" className="text-center" />
        <Offers />
      </section>
    </div>
  );
}
