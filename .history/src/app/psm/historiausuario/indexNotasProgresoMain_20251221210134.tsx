import dynamic from "next/dynamic";

const NotasProgresoMain = dynamic(() => import("./NotasProgresoMain"), { ssr: false });

export default NotasProgresoMain;
