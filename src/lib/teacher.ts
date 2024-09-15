export function isTeacher(userID: string | null | undefined) {
  return userID === process.env.NEXT_PUBLIC_TEACHER_ID;
}
