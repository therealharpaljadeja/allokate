import Table from "./components/Table";
import Text from "./components/Text";
import Title from "./components/Title";
import CustomConnectButton from "./components/CustomConnectButton";
import Card from "./components/Card";

export default function Home() {
    return (
        <main className="flex min-h-screen min-w-[1280px] space-y-[60px] flex-col items-center px-[60px] py-[80px] max-w-[1280px]">
            <div className="flex w-[100%] justify-between">
                <Title classnames="text-[28px] italic">AlloKate</Title>
                <CustomConnectButton />
            </div>
            <div className="flex justify-between space-x-[40px]  w-[100%]">
                <Card title="Total pools created" count="300" />
                <Card title="Total funds distributed" count="16.9 ETH" />
                <Card title="Total projects registered" count="71" />
            </div>
            <div className="flex w-full flex-col space-y-[20px]">
                <h2 className="font-PlayFairDisplay text-[20px]">Pools</h2>
                <Table />
            </div>
        </main>
    );
}
