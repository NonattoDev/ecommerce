import Carousel from "react-bootstrap/Carousel";
import Tv from "./imagensCarrossel/iphone.png";
import imagem from "./imagensCarrossel/imagem3.png";
import imagemm from "./imagensCarrossel/D_NQ_774667-MLA71947790924_092023-OO.png";
import kabum from "./imagensCarrossel/themes.kabum.png";
import Image from "next/image";
import styles from "./carrossel.module.css";

function Carrossel() {
  return (
    <div className="carroselContent">
      <Carousel className={styles.carrossel} fade>
        <Carousel.Item className={styles.imageContent}>
          <Image src={Tv} alt="Imagem teste" fill priority sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Carousel.Item>
        <Carousel.Item className={styles.imageContent}>
          <Image src={imagem} alt="Imagem teste" fill priority sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Carousel.Item>
        <Carousel.Item className={styles.imageContent}>
          <Image src={imagemm} alt="Imagem teste" fill priority sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Carousel.Item>
        <Carousel.Item className={styles.imageContent}>
          <Image src={kabum} alt="Imagem teste" fill priority sizes="(max-width: 1920px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Carrossel;
