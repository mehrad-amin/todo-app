import AddToDoPage from "@/components/template/AddToDoPage";
import { getSession } from "next-auth/react";

const AddToDo = () => {
  return <AddToDoPage />;
};

export default AddToDo;
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
