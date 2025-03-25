import Image from "next/image";
import SearchBar from "./components/SearchBar";
import TestApiResponse from "./components/TestApiResponse";
export default function Home() {
  return (
    <div>
      <SearchBar />
      {/* <TestApiResponse /> */}
    </div>
  );
}
