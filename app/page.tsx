import Table from "./components/Table";
import Card from "./components/Card";

export default function Home() {
    return (
        <>
            <div className="flex justify-between space-x-[40px]  w-[100%]">
                <Card title="Total pools created" count="300" />
                <Card title="Total funds distributed" count="16.9 ETH" />
                <Card title="Total projects registered" count="71" />
            </div>
            <div className="flex w-full flex-col space-y-[20px]">
                <h2 className="font-PlayFairDisplay text-[20px]">Pools</h2>
                <Table />
            </div>
        </>
    );
}
