import { ShoppingBagIcon } from "lucide-react";
import { JoinAgriconnectBanner } from '../../../components/JoinAgriconnectBanner';
import React from "react";
import { Badge } from "../../../components/badge";
import { Card, CardContent } from "../../../components/cards";
import { Button } from "../../../components";

const categories = [
    { name: "Legumes", active: false },
    { name: "Frutas", active: false },
    { name: "Verduras", active: false },
];


const featuredProducts = [
    {
        type: "product",
        image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56.png",
        title: "Abóbora (kg)",
        originalPrice: "R$ 10,30",
        salePrice: "R$ 08,55",
    },
    {
        type: "product",
        image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56.png",
        title: "Abóbora (kg)",
        originalPrice: "R$ 10,30",
        salePrice: "R$ 08,55",
    },
    {
        type: "product",
        image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-2.png",
        title: "Banana Prata (kg)",
        originalPrice: "R$ 10,00",
        salePrice: "R$ 08,70",
    },
    {
        type: "product",
        image: "https://c.animaapp.com/meda5qjaouVHG5/img/rectangle-56-3.png",
        title: "Maçã Verde (unid)",
        originalPrice: "R$ 03,45",
        salePrice: "R$ 02,60",
    },
];


export const MainContentSection = (): React.ReactElement => {
    return (
        <section className="flex flex-col w-full items-center gap-16 px-4 md:px-6 py-16">
            <div className="w-full">
                <div className="w-full max-w-[1108px] mx-auto">
                    <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
                        Produtos em destaque
                    </h1>
                </div>

                <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-[19px] overflow-x-auto pb-4">
                    {featuredProducts.map((item, index) => (
                        <Card
                            key={index}
                            className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
                        >
                            <img
                                className="h-[263px] relative self-stretch w-full object-cover"
                                alt={item.title}
                                src={item.image}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(item.title);
                                }}
                            />
                            <CardContent
                                className={`flex flex-col ${item.type === "association" ? "items-center" : "items-start"} px-4 py-0 relative self-stretch w-full flex-[0_0_auto]`}
                            >
                                {item.type === "product" ? (
                                    <>
                                        <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                            {item.title}
                                        </div>
                                        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-sm text-center tracking-[0] leading-[normal] line-through">
                                                {item.originalPrice}
                                            </div>
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                                                {item.salePrice}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="self-stretch h-6 font-bold text-texto text-base text-center leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                        {item.title}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-[1108px] mx-auto">
                <h1 className="w-full [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-2xl mb-6">
                    Confira nossos Produtos
                </h1>
            </div>
            <div className="w-full flex justify-center mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full max-w-[1108px]">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((category, index) => (
                            <Badge
                                key={`category-${index}`}
                                variant={category.active ? "default" : "outline"}
                                className={`h-12 px-6 py-[3px] rounded-2xl text-sm font-bold [font-family:'Montserrat',Helvetica] ${category.active
                                    ? "bg-[#92a916] text-fundo-claro border-[#fafcf9] hover:bg-[#92a916]"
                                    : "bg-fundo-claro text-[#92a916] border-[#92a916] hover:bg-[#92a916] hover:text-fundo-claro"
                                    } transition-colors cursor-pointer`}
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-[19px] overflow-x-auto pb-4">
                    {featuredProducts.map((item, index) => (
                        <Card
                            key={index}
                            className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
                        >
                            <img
                                className="h-[263px] relative self-stretch w-full object-cover"
                                alt={item.title}
                                src={item.image}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(item.title);
                                }}
                            />
                            <CardContent
                                className={`flex flex-col ${item.type === "association" ? "items-center" : "items-start"} px-4 py-0 relative self-stretch w-full flex-[0_0_auto]`}
                            >
                                {item.type === "product" ? (
                                    <>
                                        <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                            {item.title}
                                        </div>
                                        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-sm text-center tracking-[0] leading-[normal] line-through">
                                                {item.originalPrice}
                                            </div>
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                                                {item.salePrice}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl mt-2"
                                        >
                                            <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                                                Adicionar à sacola
                                            </span>
                                            <ShoppingBagIcon className="w-6 h-6 ml-2" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="self-stretch h-6 font-bold text-texto text-base text-center leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                        {item.title}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <div className="w-full max-w-[1108px] mx-auto flex items-center justify-center gap-[19px] overflow-x-auto pb-4">
                    {featuredProducts.map((item, index) => (
                        <Card
                            key={index}
                            className="flex-col min-w-[263px] w-[263px] items-start gap-4 pt-0 pb-4 px-0 bg-fundo-claro border border-solid border-[#d5d7d4] shadow-[0px_0px_4px_#00000033] rounded-[25px] overflow-hidden"
                        >
                            <img
                                className="h-[263px] relative self-stretch w-full object-cover"
                                alt={item.title}
                                src={item.image}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/263x263/9cb217/ffffff?text=" + encodeURIComponent(item.title);
                                }}
                            />
                            <CardContent
                                className={`flex flex-col ${item.type === "association" ? "items-center" : "items-start"} px-4 py-0 relative self-stretch w-full flex-[0_0_auto]`}
                            >
                                {item.type === "product" ? (
                                    <>
                                        <div className="w-[231px] h-6 mt-[-1.00px] font-medium text-texto text-base leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                            {item.title}
                                        </div>
                                        <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                                            <div className="relative w-fit [font-family:'Montserrat',Helvetica] font-normal italic text-[#9f9f9f] text-sm text-center tracking-[0] leading-[normal] line-through">
                                                {item.originalPrice}
                                            </div>
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-verde-escuro text-base text-center tracking-[0] leading-[normal]">
                                                {item.salePrice}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-auto w-fit bg-fundo-claro border-[#9cb217] text-verde-claro hover:bg-verde-claro hover:text-fundo-claro transition-colors px-6 py-2.5 rounded-2xl mt-2"
                                        >
                                            <span className="font-[number:var(--bot-es-font-weight)] text-[length:var(--bot-es-font-size)] font-bot-es">
                                                Adicionar à sacola
                                            </span>
                                            <ShoppingBagIcon className="w-6 h-6 ml-2" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="self-stretch h-6 font-bold text-texto text-base text-center leading-[normal] relative [font-family:'Montserrat',Helvetica] tracking-[0]">
                                        {item.title}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <JoinAgriconnectBanner />
        </section>
    );
};
