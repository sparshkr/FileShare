import Card2 from "../Components/Card2";
import { useEffect, useState } from "react";

export default function MyFiles(props) {
  const [filesTotal, setFilesTotal] = useState([]);

  useEffect(() => {
    // console.log(props.state);
    const getTotalSupply = async () => {
      try {
        const files = await props.state.contract.getBoughtFiles();

        setFilesTotal(files); // Update state
        console.log(files[0].id.toString()); // Log the fetched files
        console.log(files[0].link); // Log the fetched files
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    };

    if (props.state.contract) {
      getTotalSupply();
    }
  }, [props.state.contract]);

  return (
    <div className="bg-gray-300 border-box h-screen -m-0.5rem p-0 overflow-auto">
      <div className="flex flex-wrap justify-center -mt-0.5rem">
        {/* <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card> */}
        {filesTotal.map((file) => {
          return (
            <Card2
              id={file.id.toString()}
              key={file.id.toString()}
              author={file.author}
              price={file.price.toString()}
              title={file.title}
              link={file.link}
            ></Card2>
          );
        })}
      </div>
    </div>
  );
}
