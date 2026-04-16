import { Icons } from "@/icons";

export default function Header() {
return (
<div className="w-full flex justify-center py-4 bg-background">

    {/* Container 90% */}
    <div className="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">

        {/* Logo */}
        <div className="flex items-center">
            <img src="/logo.svg" alt="" className="w-[70%]" />
        </div>



        {/* Right Icons */}
        <div className="flex items-center gap-3">

            {/* Search */}
            <div className="flex items-center bg-gray-light px-3 py-2 rounded-lg w-64">
                <input type="text" placeholder="Cari faskes" className="bg-transparent outline-none flex-1 text-sm" />
                <span className="text-gray-dark"><Icons.search size={20} /></span>
            </div>

            {/* Notification */}
            <button className="w-9 h-9 rounded-lg bg-gray-light flex items-center justify-center">
                <Icons.bell size={20} />
            </button>

            {/* Help */}
            <button className="w-9 h-9 rounded-lg bg-gray-light flex items-center justify-center">
                <Icons.help size={20} />
            </button>
        </div>

    </div>
</div>
);
}