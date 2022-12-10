// WE ARE USING SIMPLES ICONS
// https://react-icons.github.io/react-icons/icons?name=sl

// Farmer icons
//https://react-icons.github.io/react-icons/icons?name=gi
import { GiCow, GiSheep } from 'react-icons/gi'

import {
  SlArrowDown,
  SlArrowLeft,
  SlArrowRight,
  SlArrowUp,
  SlBan,
  SlBasketLoaded,
  SlBell,
  SlBookOpen,
  SlCalculator,
  SlCalender,
  SlCamera,
  SlChart,
  SlCheck,
  SlClose,
  SlCreditCard,
  SlEvent,
  SlExclamation,
  SlHome,
  SlLink,
  SlList,
  SlLocationPin,
  SlLogin,
  SlLogout,
  SlMagnifier,
  SlMap,
  SlNote,
  SlPhone,
  SlPicture,
  SlPlus,
  SlSettings,
  SlShare,
  SlSocialFacebook,
  SlSocialGoogle,
  SlSocialInstagram,
  SlSymbleFemale,
  SlSymbolMale,
  SlTag,
  SlTrash,
  SlUser,
  SlWrench
} from 'react-icons/sl'

const ICON_LIST = {
  cart: SlBasketLoaded,
  login: SlLogin,
  logout: SlLogout,
  loop: SlLogout,
  google: SlSocialGoogle,
  instagram: SlSocialInstagram,
  facebook: SlSocialFacebook,
  map: SlMap,
  location: SlLocationPin,
  link: SlLink,
  image: SlPicture,
  edit: SlNote,
  male: SlSymbolMale,
  female: SlSymbleFemale,
  tag: SlTag,
  user: SlUser,
  delete: SlTrash,
  list: SlList,
  search: SlMagnifier,
  home: SlHome,
  info: SlExclamation,
  done: SlCheck,
  down: SlArrowDown,
  up: SlArrowUp,
  left: SlArrowLeft,
  right: SlArrowRight,
  calendar: SlCalender,
  chart: SlChart,
  camera: SlCamera,
  bell: SlBell,
  baned: SlBan,
  phone: SlPhone,
  fix: SlWrench,
  settings: SlSettings,
  share: SlShare,
  calculator: SlCalculator,
  book: SlBookOpen,
  event: SlEvent,
  plus: SlPlus,
  creditCard: SlCreditCard,
  close: SlClose,
  sheep: GiSheep,
  cow: GiCow
  // emergency: MdOutlineEmergency,
  // email: TiMail,
  // whatsapp: SiWhatsapp,
  // save: AiOutlineSave,
  // 'rigth-arrow': AiOutlineRight,
  // 'left-arrow': AiOutlineLeft,
  // document: TiDocumentText,
  // gear: TiCogOutline,
  // phone: MdOutlinePhoneForwarded,
  // cross: TiTimes,
  // plus: TiPlusOutline,
  // minus: TiMinusOutline,
  // info: TiInfoLarge,
  // filter: TiFilter,
  // edit: TiEdit,
  // trash: TiTrash,
  // delete: TiTrash,
  // down: TiArrowSortedDown,
  // up: TiArrowSortedUp,
  // back: TiChevronLeft,
  // forward: TiChevronRight,
  // home: TiHome,
  // group: TiGroup,
  // user: TiUser,
  // wifi: TiWiFi,
  // done: TiTick,
  // addUser: TiUserAdd,
  // removeUser: TiUserDelete,
  // search: TiZoom,
  // right: TiMediaPlay,
  // left: TiMediaPlayReverse,
  // dots: MdOutlineMoreVert,
  // workout: CgGym,
  // event: MdOutlineEvent,
  // copy: RiFileCopyLine,
  // copyFill: RiFileCopyFill,
  // openEye: BsFillEyeFill,
  // closeEye: BsFillEyeSlashFill,
  // heart: FaRegHeart,
  // coments: FaRegComment,
  // heartFill: FaHeart,
  // share: BsShareFill,
  // location: MdLocationOn,
  // hideLocation: MdLocationOff
} as const

export type IconName = keyof typeof ICON_LIST
export type ReactIconElement = typeof ICON_LIST[IconName]

export default ICON_LIST
