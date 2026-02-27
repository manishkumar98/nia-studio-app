export default function Footer() {
    return (
        <footer className="bg-[#f5f5f7] px-6 pb-12 pt-1">
            <div className="max-w-7xl mx-auto pt-20 border-t border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-[#6e6e73]">
                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-[#1d1d1f]">Shop & Learn</h4>
                        <ul className="space-y-3 text-xs">
                            <li><a href="#" className="hover:underline">Studio</a></li>
                            <li><a href="#" className="hover:underline">Flow</a></li>
                            <li><a href="#" className="hover:underline">Tribe</a></li>
                        </ul>
                    </div>
                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-[#1d1d1f]">Services</h4>
                        <ul className="space-y-3 text-xs">
                            <li><a href="#" className="hover:underline">Job Matching</a></li>
                            <li><a href="#" className="hover:underline">Co-Living</a></li>
                            <li><a href="#" className="hover:underline">Upskilling</a></li>
                        </ul>
                    </div>
                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-[#1d1d1f]">Nia One</h4>
                        <ul className="space-y-3 text-xs">
                            <li><a href="#" className="hover:underline">About Us</a></li>
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Partner With Us</a></li>
                        </ul>
                    </div>
                    <div className="space-y-5">
                        <h4 className="text-xs font-bold text-[#1d1d1f]">Support</h4>
                        <ul className="space-y-3 text-xs">
                            <li><a href="#" className="hover:underline">Contact Us</a></li>
                            <li><a href="#" className="hover:underline">FAQ</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[#6e6e73] text-[11px]">
                    <p>© 2026 Nia One. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Use</a>
                        <a href="#" className="hover:underline">Legal</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
