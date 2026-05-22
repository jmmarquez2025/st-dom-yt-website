import {
  Flame, Sparkles, Cross, Users, Shield, HandHeart, Music,
  BookOpen, HeartHandshake, BookMarked, Heart, Globe,
  MapPin, Phone, Clock, Mail, Droplets, Wheat, FireExtinguisher,
  Gem, Bird, Church, DoorOpen, Armchair, BookOpenText, Handshake,
  Newspaper, Gift, TrendingUp, Search, CircleDot,
  Car, Baby, Languages, ParkingCircle, CreditCard, Repeat2,
  FileText, ExternalLink,
  Ruler, Building, Calendar, Maximize, ArrowUp,
  PhoneCall, Compass, ArrowRight, HeartPulse, ClipboardList,
} from "lucide-react";

/**
 * Icon registry — maps string names to Lucide components.
 * Used so data files can store icon names as plain strings.
 */
const ICONS = {
  Flame, Sparkles, Cross, Users, Shield, HandHeart, Music,
  BookOpen, HeartHandshake, BookMarked, Heart, Globe,
  MapPin, Phone, Clock, Mail, Droplets, Wheat, FireExtinguisher,
  Gem, Bird, Church, DoorOpen, Armchair, BookOpenText, Handshake,
  Newspaper, Gift, TrendingUp, Search, CircleDot,
  Car, Baby, Languages, ParkingCircle, CreditCard, Repeat2,
  FileText, ExternalLink,
  Ruler, Building, Calendar, Maximize, ArrowUp,
  PhoneCall, Compass, ArrowRight, HeartPulse, ClipboardList,
};

/**
 * Renders a Lucide icon by string name.
 *
 * @param {string} name - Icon name (e.g. "Heart", "Globe")
 * @param {number} size - Icon size in px (default 24)
 * @param {string} color - Stroke color
 * @param {number} strokeWidth - Stroke width (default 1.5)
 */
export default function Icon({ name, size = 24, color, strokeWidth = 1.5, style = {}, className = "" }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component size={size} color={color} strokeWidth={strokeWidth} style={style} className={className} aria-hidden="true" />;
}
