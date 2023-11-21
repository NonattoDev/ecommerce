import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";
import styles from "./carrossel.module.css";

function Carrossel() {
  const [fileNames, setFileNames] = useState([]);

  useEffect(() => {
    async function fetchFileNames() {
      try {
        const response = await axios.get("/api/banners");
        const fileNames = response.data;
        setFileNames(fileNames);
      } catch (error) {
        console.error("Erro ao obter os nomes de arquivo", error);
      }
    }

    fetchFileNames();
  }, []);

  return (
    <div className="carroselContent">
      <Carousel className={styles.carrossel} fade>
        {fileNames.map((fileName, index) => (
          <Carousel.Item key={index} className={styles.imageContent}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BANNERSIMAGEMURL}/${fileName}`}
              alt={`Imagem ${index}`}
              fill
              priority
              sizes="(max-width: 1920px) 100vw, (max-width: 1080px) 50vw, 33vw"
              loading="eager"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Carrossel;
