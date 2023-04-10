import { MoonLoader } from "react-spinners";

// loader component for dashboard to show loading state
const Loader = () => {
  return (
    <div className="loader">
      <MoonLoader color="#36d7b7" size={80} />
    </div>
  );
};

export default Loader;
