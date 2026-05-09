"use client";

import {
  ArrowPathIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  HeartIcon,
  LockClosedIcon,
  PhotoIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

const ICONS = {
  cloud: CloudArrowUpIcon,
  lock: LockClosedIcon,
  refresh: ArrowPathIcon,
  fingerprint: FingerPrintIcon,
  sparkles: SparklesIcon,
  globe: GlobeAltIcon,
  rocket: RocketLaunchIcon,
  shield: ShieldCheckIcon,
  star: StarIcon,
  bolt: BoltIcon,
  heart: HeartIcon,
  trophy: TrophyIcon,
  chat: ChatBubbleLeftRightIcon,
  photo: PhotoIcon,
  user: UserCircleIcon,
};

interface SectionMediaProps {
  mediaType?: string;
  icon?: string;
  imageUrl?: string;
  label?: string;
  className?: string;
  imageClassName?: string;
}

export function SectionMedia({
  mediaType,
  icon,
  imageUrl,
  label,
  className,
  imageClassName,
}: SectionMediaProps) {
  const shouldRenderImage = mediaType === "image" && imageUrl;

  if (shouldRenderImage) {
    return (
      <img
        src={imageUrl}
        alt={label || ""}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    );
  }

  if (mediaType === "emoji" && icon) {
    return (
      <span className={cn("text-2xl leading-none", className)} aria-hidden="true">
        {icon}
      </span>
    );
  }

  const Icon = ICONS[(icon || "sparkles").toLowerCase() as keyof typeof ICONS] || SparklesIcon;

  return <Icon className={cn("h-6 w-6", className)} aria-hidden="true" />;
}
