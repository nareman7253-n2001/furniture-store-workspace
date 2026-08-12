import deskImg from "@/assets/cat-desks.jpg";
import chairImg from "@/assets/cat-chairs.jpg";
import executiveImg from "@/assets/cat-executive.jpg";
import receptionImg from "@/assets/project-reception.jpg";
import meetingImg from "@/assets/project-meeting.jpg";
import heroImg from "@/assets/hero-office.jpg";
import storageImg from "@/assets/cat-storage.jpg";
import completeOfficeImg from "@/assets/complete-office.jpg";
import adjustableDeskImg from "@/assets/p-adjustable-desk.jpg";
import ergoChairImg from "@/assets/p-ergonomic-chair.jpg";
import visitorChairImg from "@/assets/p-visitor-chair.jpg";
import pedestalImg from "@/assets/p-pedestal.jpg";
import filingCabinetImg from "@/assets/p-filing-cabinet.jpg";
import conferenceChairImg from "@/assets/p-conference-chair.jpg";

/**
 * Bundled demo imagery. Content stored in the database references these by
 * filename; anything else (an uploaded or external URL) is used as-is.
 */
export const BUNDLED_IMAGES: Record<string, string> = {
  "cat-desks.jpg": deskImg,
  "cat-chairs.jpg": chairImg,
  "cat-executive.jpg": executiveImg,
  "project-reception.jpg": receptionImg,
  "project-meeting.jpg": meetingImg,
  "hero-office.jpg": heroImg,
  "cat-storage.jpg": storageImg,
  "complete-office.jpg": completeOfficeImg,
  "p-adjustable-desk.jpg": adjustableDeskImg,
  "p-ergonomic-chair.jpg": ergoChairImg,
  "p-visitor-chair.jpg": visitorChairImg,
  "p-pedestal.jpg": pedestalImg,
  "p-filing-cabinet.jpg": filingCabinetImg,
  "p-conference-chair.jpg": conferenceChairImg,
};

export const BUNDLED_IMAGE_KEYS = Object.keys(BUNDLED_IMAGES);

export function resolveImage(value: string | undefined | null): string {
  if (!value) return heroImg;
  return BUNDLED_IMAGES[value] ?? value;
}
