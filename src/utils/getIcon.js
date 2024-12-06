import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5";

const iconMap = {
  BookIcon,
  PersonIcon,
  WineIcon
}

export default (name) => iconMap[name] || WineIcon
