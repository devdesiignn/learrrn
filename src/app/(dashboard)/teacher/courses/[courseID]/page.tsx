export default function CoursePage({ params }: { params: { courseID: string } }) {
  return <div>Course Page: {params.courseID}</div>;
}
