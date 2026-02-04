import zihuameHome from "@/public/images/projects/zihuame/zihuame-home.png"

import calendarHome from "@/public/images/projects/calendar/calendar-home.png"
import calendarSchedule from "@/public/images/projects/calendar/calendar-horarios.png"
import calendarEvent from "@/public/images/projects/calendar/calendar-new-event.png"
import calendarReserva from "@/public/images/projects/calendar/calendar-reserva.png"

import sayagolmsHome from "@/public/images/projects/sayagolms/sayagolms-home.png"
import sayagolmsCourse from "@/public/images/projects/sayagolms/sayagolms-course.png"
import sayagolmsLesson from "@/public/images/projects/sayagolms/sayagolms-lesson.png"

import chatHome from "@/public/images/projects/chat/chat-home.png"
import chatRoom from "@/public/images/projects/chat/chat-room.png"
import chatJoin from "@/public/images/projects/chat/chat-join.png"

import { StaticImageData } from "next/image"

export type ProjectMediaType = {
  src: StaticImageData | string
  alt: string
  width: number
  height: number
}[]

export const zihuameMedia: ProjectMediaType = [
  { src: zihuameHome, alt: "Zihuame Mochilla - Homepage design", width: 1920, height: 1080 },
  {
    src: "/images/projects/zihuame/donar.webm",
    alt: "Zihuame Mochilla - Donor Steps",
    width: 622,
    height: 768,
  },
]

export const calendarMedia: ProjectMediaType = [
  { src: calendarHome, alt: "Calendar;dev - Homepage desing", width: 1920, height: 1080 },
  {
    src: calendarSchedule,
    alt: "Calendar;dev - Schedule configuration UI",
    width: 1920,
    height: 1080,
  },
  { src: calendarEvent, alt: "Calendar;dev - Create new event UI", width: 1920, height: 1080 },
  { src: calendarReserva, alt: "Calendar;dev - Booking/reservation UI", width: 1920, height: 1080 },
]

export const sayagolmsMedia: ProjectMediaType = [
  { src: sayagolmsHome, alt: "SáyagodevLMS - Homepage design", width: 1920, height: 1080 },
  { src: sayagolmsCourse, alt: "SáyagodevLMS - Course details UI", width: 1920, height: 1080 },
  { src: sayagolmsLesson, alt: "SáyagodevLMS - Lesson content UI", width: 1920, height: 1080 },
  {
    src: "/images/projects/sayagolms/create-course.webm",
    alt: "SáyagodevLMS - Create course UI",
    width: 720,
    height: 778,
  },
]

export const chatMedia: ProjectMediaType = [
  { src: chatHome, alt: ">chat_privado - Homepage UI", width: 1920, height: 1080 },
  { src: chatRoom, alt: ">chat_privado - Chat room view", width: 1920, height: 1080 },
  { src: chatJoin, alt: ">chat_privado - Join room screen", width: 1920, height: 1080 },
  {
    src: "/images/projects/chat/create-room.webm",
    alt: ">chat_privado - Create room UI",
    width: 720,
    height: 740,
  },
]

export const projectMedia: Record<string, ProjectMediaType> = {
  zihuame: zihuameMedia,
  calendar: calendarMedia,
  sayagolms: sayagolmsMedia,
  chat: chatMedia,
}

export function getProjectMedia(projectName: string) {
  return projectMedia[projectName] || []
}
