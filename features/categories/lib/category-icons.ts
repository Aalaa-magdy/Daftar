import Agreement01Icon from '@hugeicons/core-free-icons/Agreement01Icon';
import Airplane01Icon from '@hugeicons/core-free-icons/Airplane01Icon';
import Baby01Icon from '@hugeicons/core-free-icons/Baby01Icon';
import BankIcon from '@hugeicons/core-free-icons/BankIcon';
import Book01Icon from '@hugeicons/core-free-icons/Book01Icon';
import Briefcase01Icon from '@hugeicons/core-free-icons/Briefcase01Icon';
import Bus01Icon from '@hugeicons/core-free-icons/Bus01Icon';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import Camera01Icon from '@hugeicons/core-free-icons/Camera01Icon';
import Car03Icon from '@hugeicons/core-free-icons/Car03Icon';
import ChefHatIcon from '@hugeicons/core-free-icons/ChefHatIcon';
import Coffee01Icon from '@hugeicons/core-free-icons/Coffee01Icon';
import Cupcake01Icon from '@hugeicons/core-free-icons/Cupcake01Icon';
import DeliveryTruck01Icon from '@hugeicons/core-free-icons/DeliveryTruck01Icon';
import DentalToothIcon from '@hugeicons/core-free-icons/DentalToothIcon';
import Dress01Icon from '@hugeicons/core-free-icons/Dress01Icon';
import Dumbbell01Icon from '@hugeicons/core-free-icons/Dumbbell01Icon';
import FavouriteIcon from '@hugeicons/core-free-icons/FavouriteIcon';
import Film01Icon from '@hugeicons/core-free-icons/Film01Icon';
import FlowerIcon from '@hugeicons/core-free-icons/FlowerIcon';
import GameController03Icon from '@hugeicons/core-free-icons/GameController03Icon';
import GiftIcon from '@hugeicons/core-free-icons/GiftIcon';
import GraduationScrollIcon from '@hugeicons/core-free-icons/GraduationScrollIcon';
import HairDryerIcon from '@hugeicons/core-free-icons/HairDryerIcon';
import Hamburger02Icon from '@hugeicons/core-free-icons/Hamburger02Icon';
import HeadphonesIcon from '@hugeicons/core-free-icons/HeadphonesIcon';
import HealthIcon from '@hugeicons/core-free-icons/HealthIcon';
import HomeWifiIcon from '@hugeicons/core-free-icons/HomeWifiIcon';
import House03Icon from '@hugeicons/core-free-icons/House03Icon';
import InvoiceIcon from '@hugeicons/core-free-icons/InvoiceIcon';
import IslandIcon from '@hugeicons/core-free-icons/IslandIcon';
import Key01Icon from '@hugeicons/core-free-icons/Key01Icon';
import LaptopIcon from '@hugeicons/core-free-icons/LaptopIcon';
import Message01Icon from '@hugeicons/core-free-icons/Message01Icon';
import MoneyBag01Icon from '@hugeicons/core-free-icons/MoneyBag01Icon';
import MusicNote01Icon from '@hugeicons/core-free-icons/MusicNote01Icon';
import OnlineLearning01Icon from '@hugeicons/core-free-icons/OnlineLearning01Icon';
import Pizza01Icon from '@hugeicons/core-free-icons/Pizza01Icon';
import Plant01Icon from '@hugeicons/core-free-icons/Plant01Icon';
import Robot01Icon from '@hugeicons/core-free-icons/Robot01Icon';
import ShoppingBag01Icon from '@hugeicons/core-free-icons/ShoppingBag01Icon';
import ShoppingCart01Icon from '@hugeicons/core-free-icons/ShoppingCart01Icon';
import SourceCodeIcon from '@hugeicons/core-free-icons/SourceCodeIcon';
import StethoscopeIcon from '@hugeicons/core-free-icons/StethoscopeIcon';
import TennisBallIcon from '@hugeicons/core-free-icons/TennisBallIcon';
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon';
import Wallet03Icon from '@hugeicons/core-free-icons/Wallet03Icon';
import Wrench01Icon from '@hugeicons/core-free-icons/Wrench01Icon';
import type { IconSvgElement } from '@hugeicons/react-native';

export type CategoryIconOption = {
  faIcon: string;
  icon: IconSvgElement;
};

/** Maps Font Awesome icon strings (API) to Hugeicons (UI). */
export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  { faIcon: 'fa-solid fa-utensils', icon: Hamburger02Icon },
  { faIcon: 'fa-solid fa-cookie-bite', icon: Cupcake01Icon },
  { faIcon: 'fa-solid fa-hat-chef', icon: ChefHatIcon },
  { faIcon: 'fa-solid fa-tooth', icon: DentalToothIcon },
  { faIcon: 'fa-solid fa-shirt', icon: Dress01Icon },
  { faIcon: 'fa-solid fa-wallet', icon: Wallet03Icon },
  { faIcon: 'fa-solid fa-file-invoice-dollar', icon: InvoiceIcon },
  { faIcon: 'fa-solid fa-sack-dollar', icon: MoneyBag01Icon },
  { faIcon: 'fa-solid fa-briefcase', icon: Briefcase01Icon },
  { faIcon: 'fa-solid fa-building-columns', icon: BankIcon },
  { faIcon: 'fa-solid fa-car', icon: Car03Icon },
  { faIcon: 'fa-solid fa-truck', icon: DeliveryTruck01Icon },
  { faIcon: 'fa-solid fa-plane', icon: Airplane01Icon },
  { faIcon: 'fa-solid fa-umbrella-beach', icon: IslandIcon },
  { faIcon: 'fa-solid fa-wrench', icon: Wrench01Icon },
  { faIcon: 'fa-solid fa-key', icon: Key01Icon },
  { faIcon: 'fa-solid fa-headphones', icon: HeadphonesIcon },
  { faIcon: 'fa-solid fa-laptop', icon: LaptopIcon },
  { faIcon: 'fa-solid fa-wifi', icon: HomeWifiIcon },
  { faIcon: 'fa-solid fa-code', icon: SourceCodeIcon },
  { faIcon: 'fa-solid fa-robot', icon: Robot01Icon },
  { faIcon: 'fa-solid fa-heart', icon: FavouriteIcon },
  { faIcon: 'fa-solid fa-graduation-cap', icon: GraduationScrollIcon },
  { faIcon: 'fa-solid fa-book', icon: Book01Icon },
  { faIcon: 'fa-solid fa-gift', icon: GiftIcon },
  { faIcon: 'fa-solid fa-calendar', icon: Calendar03Icon },
  { faIcon: 'fa-solid fa-comment', icon: Message01Icon },
  { faIcon: 'fa-solid fa-baseball', icon: TennisBallIcon },
  { faIcon: 'fa-solid fa-seedling', icon: Plant01Icon },
  { faIcon: 'fa-solid fa-handshake', icon: Agreement01Icon },
  { faIcon: 'fa-solid fa-gamepad', icon: GameController03Icon },
  { faIcon: 'fa-solid fa-bag-shopping', icon: ShoppingBag01Icon },
  { faIcon: 'fa-solid fa-chalkboard-user', icon: OnlineLearning01Icon },
  { faIcon: 'fa-solid fa-heart-pulse', icon: HealthIcon },
  { faIcon: 'fa-solid fa-spray-can-sparkles', icon: HairDryerIcon },
  { faIcon: 'fa-solid fa-house', icon: House03Icon },
  { faIcon: 'fa-solid fa-users', icon: UserGroupIcon },
  { faIcon: 'fa-solid fa-mug-hot', icon: Coffee01Icon },
  { faIcon: 'fa-solid fa-pizza-slice', icon: Pizza01Icon },
  { faIcon: 'fa-solid fa-cart-shopping', icon: ShoppingCart01Icon },
  { faIcon: 'fa-solid fa-dumbbell', icon: Dumbbell01Icon },
  { faIcon: 'fa-solid fa-stethoscope', icon: StethoscopeIcon },
  { faIcon: 'fa-solid fa-baby', icon: Baby01Icon },
  { faIcon: 'fa-solid fa-spa', icon: FlowerIcon },
  { faIcon: 'fa-solid fa-film', icon: Film01Icon },
  { faIcon: 'fa-solid fa-music', icon: MusicNote01Icon },
  { faIcon: 'fa-solid fa-camera', icon: Camera01Icon },
  { faIcon: 'fa-solid fa-bus', icon: Bus01Icon },
];

export const CATEGORY_PICKER_ICONS = CATEGORY_ICON_OPTIONS.map((item) => item.icon);

export const DEFAULT_CATEGORY_ICON = CATEGORY_PICKER_ICONS[0];

export function resolveCategoryIcon(icon: string): IconSvgElement {
  const faMatch = CATEGORY_ICON_OPTIONS.find((item) => item.faIcon === icon);
  if (faMatch) return faMatch.icon;

  const aliasMatch = CATEGORY_ICON_ALIASES[icon];
  if (aliasMatch) return aliasMatch;

  return DEFAULT_CATEGORY_ICON;
}

const CATEGORY_ICON_ALIASES: Record<string, IconSvgElement> = {
  ShoppingBag: ShoppingBag01Icon,
  ShoppingCart: ShoppingCart01Icon,
  GameController: GameController03Icon,
  GraduationScroll: GraduationScrollIcon,
  MoneyBag: MoneyBag01Icon,
  HomeWifi: HomeWifiIcon,
  House: House03Icon,
  Health: HealthIcon,
  Favourite: FavouriteIcon,
  Wallet: Wallet03Icon,
  Briefcase: Briefcase01Icon,
  Bank: BankIcon,
  Car: Car03Icon,
  Airplane: Airplane01Icon,
  Book: Book01Icon,
  Gift: GiftIcon,
  Calendar: Calendar03Icon,
  Coffee: Coffee01Icon,
  Pizza: Pizza01Icon,
  Film: Film01Icon,
  Music: MusicNote01Icon,
  Camera: Camera01Icon,
  Bus: Bus01Icon,
  Dumbbell: Dumbbell01Icon,
  Stethoscope: StethoscopeIcon,
  Baby: Baby01Icon,
  Flower: FlowerIcon,
  Hamburger: Hamburger02Icon,
  ChefHat: ChefHatIcon,
  Cupcake: Cupcake01Icon,
  DentalTooth: DentalToothIcon,
  Dress: Dress01Icon,
  Invoice: InvoiceIcon,
  DeliveryTruck: DeliveryTruck01Icon,
  Island: IslandIcon,
  Wrench: Wrench01Icon,
  Key: Key01Icon,
  Headphones: HeadphonesIcon,
  Laptop: LaptopIcon,
  Robot: Robot01Icon,
  OnlineLearning: OnlineLearning01Icon,
  HairDryer: HairDryerIcon,
  UserGroup: UserGroupIcon,
  TennisBall: TennisBallIcon,
  Plant: Plant01Icon,
  Agreement: Agreement01Icon,
  Message: Message01Icon,
  SourceCode: SourceCodeIcon,
};

export function resolveFaIcon(icon: IconSvgElement): string {
  return (
    CATEGORY_ICON_OPTIONS.find((item) => item.icon === icon)?.faIcon ??
    CATEGORY_ICON_OPTIONS[0].faIcon
  );
}

export function resolveFaIconFromString(faIcon: string): string {
  const match = CATEGORY_ICON_OPTIONS.find((item) => item.faIcon === faIcon);
  return match?.faIcon ?? CATEGORY_ICON_OPTIONS[0].faIcon;
}
