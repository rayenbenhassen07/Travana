import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import { MdOutlineVilla } from "react-icons/md";
import {
  GiIsland,
  GiBoatFishing,
  GiCastle,
  GiForestCamp,
  GiCactus,
} from "react-icons/gi";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";

export const categories = [
  {
    label: "Plage",
    icon: TbBeach,
    description: "Cette propriété est proche de la plage !",
  },
  {
    label: "Moderne",
    icon: MdOutlineVilla,
    description: "Cette propriété est moderne !",
  },
  {
    label: "Campagne",
    icon: TbMountain,
    description: "Cette propriété est à la campagne !",
  },
  {
    label: "Piscines",
    icon: TbPool,
    description: "Cette propriété a une belle piscine !",
  },
  {
    label: "Îles",
    icon: GiIsland,
    description: "Cette propriété est sur une île !",
  },
  {
    label: "Lac",
    icon: GiBoatFishing,
    description: "Cette propriété est près d'un lac !",
  },
  {
    label: "Châteaux",
    icon: GiCastle,
    description: "Cette propriété est un ancien château !",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "Cette propriété offre des activités de camping !",
  },
  {
    label: "Arctique",
    icon: BsSnow,
    description: "Cette propriété est dans un environnement arctique !",
  },
  {
    label: "Désert",
    icon: GiCactus,
    description: "Cette propriété est dans le désert !",
  },
  {
    label: "Luxe",
    icon: IoDiamond,
    description: "Cette propriété est neuve et luxueuse !",
  },
];
