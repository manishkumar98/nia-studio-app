import { useState, useEffect } from 'react'
import { usePoints } from '../context/PointsContext'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mockUsers'

export default function Scanner() {
    const { fulfillRedemption, getBalance, vouchers } = usePoints()
    const { currentUser } = useAuth()
    const [code, setCode] = useState('')
    const [scannedVoucher, setScannedVoucher] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isScanning, setIsScanning] = useState(true)

    const handleLookup = (e) => {
        if (e) e.preventDefault()
        if (code.length < 6) return

        setError('')
        setSuccess(false)

        const voucher = vouchers.find(v => v.code === code.toUpperCase())

        if (!voucher) {
            setError('INVALID VOUCHER CODE')
            setScannedVoucher(null)
            return
        }

        if (voucher.status !== 'PENDING') {
            setError(`VOUCHER ALREADY ${voucher.status}`)
            setScannedVoucher(null)
            return
        }

        // Get resident details
        const resident = mockUsers.find(u => u.id === voucher.userId)
        const balance = getBalance(voucher.userId)

        setScannedVoucher({
            ...voucher,
            residentName: resident ? resident.name : 'Unknown Resident',
            currentBalance: balance,
            residentNest: resident ? resident.nestName : 'N/A'
        })
        setIsScanning(false)
    }

    const handleFulfill = () => {
        const result = fulfillRedemption(scannedVoucher.code)
        if (result.success) {
            setSuccess(true)
            setScannedVoucher(null)
            setCode('')
            setIsScanning(true)
            // Clear success after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        } else {
            setError(result.message)
        }
    }

    const resetScanner = () => {
        setScannedVoucher(null)
        setCode('')
        setIsScanning(true)
        setError('')
    }

    return (
        <div className="px-6 py-8 pb-32 max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-10 text-center">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Staff Verification Mode
                </div>
                <h1 className="text-4xl font-black text-[#1d1d1f] mb-3 tracking-tight">Nia Terminal 🤳</h1>
                <p className="text-[#6e6e73] font-medium max-w-sm mx-auto">Verify resident vouchers and fulfill point-based rewards instantly.</p>
            </div>

            {/* Scanner Viewport */}
            <div className={`relative transition-all duration-700 ease-in-out ${scannedVoucher ? 'opacity-0 scale-95 h-0 pointer-events-none' : 'opacity-100 scale-100 mb-8'}`}>
                <div className="bg-[#1d1d1f] rounded-[40px] overflow-hidden shadow-2xl relative aspect-[4/3] md:aspect-video flex flex-col items-center justify-center p-8 border-4 border-white">
                    {/* Mock Camera Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                        <div className="w-full h-full grid grid-cols-10 gap-px opacity-10">
                            {[...Array(100)].map((_, i) => <div key={i} className="border-[0.5px] border-white/20"></div>)}
                        </div>
                    </div>

                    {/* Scanning Animation */}
                    <div className="absolute inset-x-8 top-1/2 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scanLine z-10"></div>

                    {/* Viewfinder Corners */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                    <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>

                    <form onSubmit={handleLookup} className="relative z-20 w-full max-w-xs text-center">
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Alignment Target</p>

                        <div className="mb-8">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="------"
                                maxLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-6 text-5xl font-mono font-black text-center text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:opacity-20 uppercase tracking-[0.2em]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={code.length < 6}
                            className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg ${code.length === 6
                                ? 'bg-blue-600 text-white hover:bg-blue-500 scale-105 active:scale-95'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                        >
                            Execute Lookup
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-500 text-white rounded-2xl text-xs font-black text-center animate-shake uppercase tracking-widest shadow-lg">
                        ERROR: {error}
                    </div>
                )}
            </div>

            {/* Success Feedback */}
            {success && (
                <div className="mb-8 p-8 bg-green-500 text-white rounded-[40px] flex flex-col items-center text-center animate-bounce shadow-2xl">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4">✅</div>
                    <h3 className="text-2xl font-black mb-1">TRANSACTION COMPLETE</h3>
                    <p className="font-bold opacity-80 uppercase text-[10px] tracking-widest">Points Deducted • Rewards Fulfilling</p>
                </div>
            )}

            {/* Verification Card (Digital Passport Style) */}
            {scannedVoucher && (
                <div className="animate-fadeUp perspective-1000">
                    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 transform transition-transform border-b-8 border-b-blue-600">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-20 bg-[#f5f5f7] rounded-[24px] flex items-center justify-center text-4xl shadow-inner border border-gray-100">
                                    {scannedVoucher.emoji}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Voucher Detected</div>
                                    <h2 className="text-2xl font-black text-[#1d1d1f] tracking-tight">{scannedVoucher.name}</h2>
                                    <p className="text-[#86868b] font-bold text-xs uppercase tracking-tighter">Code: {scannedVoucher.code}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase">
                                Active
                            </div>
                        </div>

                        <div className="p-8 bg-[#fafafa]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="p-4 bg-white rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-1">Resident Detail</p>
                                        <p className="text-lg font-black text-[#1d1d1f]">{scannedVoucher.residentName}</p>
                                        <p className="text-xs font-bold text-[#6e6e73] opacity-60 uppercase tracking-widest">{scannedVoucher.residentNest}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-1">Impact</p>
                                        <p className="text-xl font-black text-red-500">-{scannedVoucher.cost} <span className="text-[10px] text-red-300">PTS</span></p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase leading-tight">Will be deducted from {scannedVoucher.currentBalance} total</p>
                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <div className="flex-1 bg-white p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-tighter">
                                            Physical Handover Required
                                        </p>
                                        <p className="text-[9px] text-[#86868b] mt-1 italic">
                                            Confirm only if goods are provided.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-4 flex gap-4">
                            <button
                                onClick={handleFulfill}
                                className="flex-1 py-5 bg-[#1d1d1f] text-white rounded-[24px] font-black hover:bg-[#333] transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest text-xs"
                            >
                                Confirm Transaction
                            </button>
                            <button
                                onClick={resetScanner}
                                className="px-10 py-5 bg-gray-100 text-[#1d1d1f] rounded-[24px] font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Debugging Log for Staff */}
            <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">System Voucher Log (Staff Only)</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-[9px] font-bold text-blue-600 uppercase hover:underline"
                    >
                        Sync Database
                    </button>
                </div>

                <div className="space-y-3">
                    {vouchers.length === 0 ? (
                        <div className="p-4 bg-gray-50 rounded-2xl text-center">
                            <p className="text-[10px] text-gray-400 font-medium">No vouchers found in local database.</p>
                        </div>
                    ) : (
                        vouchers.slice(0, 5).map(v => (
                            <div
                                key={v.id}
                                onClick={() => { setCode(v.code); setError(''); }}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg opacity-80">{v.emoji}</span>
                                    <div>
                                        <p className="text-[11px] font-black text-[#1d1d1f] leading-none mb-1">{v.name}</p>
                                        <p className="text-[9px] font-bold text-[#86868b]">{v.userId} • {v.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <code className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">{v.code}</code>
                                    <p className={`text-[8px] font-black uppercase mt-1 ${v.status === 'PENDING' ? 'text-amber-500' : 'text-green-500'}`}>
                                        {v.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-12 opacity-30 text-center">
                <p className="text-[9px] uppercase font-black tracking-[0.2em] flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Nia Staff Portal Security Enabled • {currentUser.name}
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanLine {
                    0%, 100% { transform: translateY(-30px); opacity: 0; }
                    50% { transform: translateY(30px); opacity: 1; }
                }
                .animate-scanLine {
                    animation: scanLine 2s ease-in-out infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}} />
        </div>
    )
}
