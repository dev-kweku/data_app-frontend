        // "use client"

        // import { useState, useEffect } from "react"
        // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
        // import { Button } from "@/components/ui/button"
        // import { Input } from "@/components/ui/input"
        // import { Badge } from "@/components/ui/badge"
        // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
        // import { adminApi } from "@/lib/api/admin"
        // import { Vendor } from "@/types"
        // import { Search, Plus, DollarSign, AlertCircle } from "lucide-react"
        // import { FundVendorModal } from "@/components/vendor/fund-vendor-modal"
        // import { AddVendorModal } from "@/components/vendor/add-vendor-modal"

        // export default function VendorsPage() {
        // const [vendors, setVendors] = useState<Vendor[]>([])
        // const [loading, setLoading] = useState(true)
        // const [error, setError] = useState<string | null>(null)
        // const [searchTerm, setSearchTerm] = useState("")
        // const [fundModalOpen, setFundModalOpen] = useState(false)
        // const [addModalOpen, setAddModalOpen] = useState(false)
        // const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

        // useEffect(() => {
        //     fetchVendors()
        // }, [])

        // const fetchVendors = async () => {
        //     try {
        //     const response = await adminApi.getVendors()
        //     // Extract vendors array from the response
            
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     const vendorsData = (response as any).vendors || response
        //     setVendors(Array.isArray(vendorsData) ? vendorsData : [])
        //     } catch (err) {
        //     setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
        //     } finally {
        //     setLoading(false)
        //     }
        // }

        // const filteredVendors = vendors.filter(vendor =>
        //     vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //     (vendor.name && vendor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        //     vendor.id.toLowerCase().includes(searchTerm.toLowerCase())
        // )

        // const handleFundVendor = (vendor: Vendor) => {
        //     setSelectedVendor(vendor)
        //     setFundModalOpen(true)
        // }

        // const handleFundSuccess = () => {
        //     setFundModalOpen(false)
        //     setSelectedVendor(null)
        //     fetchVendors() // Refresh the list
        // }

        // const handleAddSuccess = () => {
        //     setAddModalOpen(false)
        //     fetchVendors() // Refresh the list
        // }

        // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        //     setSearchTerm(e.target.value)
        // }

        // if (loading) {
        //     return (
        //     <div className="flex items-center justify-center min-h-64">
        //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        //     </div>
        //     )
        // }

        // return (
        //     <div className="space-y-6">
        //     <div className="flex justify-between items-center">
        //         <div>
        //         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Sub-Vendors</h1>
        //         <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all vendor accounts</p>
        //         </div>
        //         <Button onClick={() => setAddModalOpen(true)}>
        //         <Plus className="h-4 w-4 mr-2" />
        //         Add Vendor
        //         </Button>
        //     </div>

        //     {error && (
        //         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
        //         <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        //         <p className="text-red-700">{error}</p>
        //         </div>
        //     )}

        //     <Card>
        //         <CardHeader>
        //         <div className="flex justify-between items-center">
        //             <CardTitle>Vendors</CardTitle>
        //             <div className="relative w-64">
        //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        //             <Input
        //                 placeholder="Search vendors..."
        //                 value={searchTerm}
        //                 onChange={handleSearch}
        //                 className="pl-10"
        //             />
        //             </div>
        //         </div>
        //         </CardHeader>
        //         <CardContent>
        //         <Table>
        //             <TableHeader>
        //             <TableRow>
        //                 <TableHead>NAME</TableHead>
        //                 <TableHead>EMAIL</TableHead>
        //                 <TableHead>WALLET BALANCE</TableHead>
        //                 <TableHead>STATUS</TableHead>
        //                 <TableHead>ACTIONS</TableHead>
        //             </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //             {filteredVendors.length === 0 ? (
        //                 <TableRow>
        //                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
        //                     {vendors.length === 0 ? "No vendors found. Add your first vendor to get started." : "No vendors match your search."}
        //                 </TableCell>
        //                 </TableRow>
        //             ) : (
        //                 filteredVendors.map((vendor) => (
        //                 <TableRow key={vendor.id}>
        //                     <TableCell className="font-medium">
        //                     {vendor.name || `Vendor ${vendor.id.slice(-6)}`}
        //                     </TableCell>
        //                     <TableCell>{vendor.email}</TableCell>
        //                     <TableCell>GHS{vendor.balance?.toFixed(2) || '0.00'}</TableCell>
        //                     <TableCell>
        //                     <Badge variant="success">
        //                         Active
        //                     </Badge>
        //                     </TableCell>
        //                     <TableCell>
        //                     <Button
        //                         variant="outline"
        //                         size="sm"
        //                         onClick={() => handleFundVendor(vendor)}
        //                     >
        //                         <DollarSign className="h-4 w-4 mr-1" />
        //                         Fund Wallet
        //                     </Button>
        //                     </TableCell>
        //                 </TableRow>
        //                 ))
        //             )}
        //             </TableBody>
        //         </Table>

        //         <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        //             <div>
        //             Showing 1 to {filteredVendors.length} of {vendors.length} entries
        //             </div>
        //         </div>
        //         </CardContent>
        //     </Card>

        //     <FundVendorModal
        //         open={fundModalOpen}
        //         onOpenChange={setFundModalOpen}
        //         vendor={selectedVendor}
        //         onSuccess={handleFundSuccess}
        //     />

        //     <AddVendorModal
        //         open={addModalOpen}
        //         onOpenChange={setAddModalOpen}
        //         onSuccess={handleAddSuccess}
        //     />
        //     </div>
        // )
        // }


        "use client"

    import { useState, useEffect } from "react"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Badge } from "@/components/ui/badge"
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
    import { adminApi } from "@/lib/api/admin"
    import { Vendor } from "@/types"
    import { Search, Plus, DollarSign, AlertCircle, Trash2 } from "lucide-react"
    import { FundVendorModal } from "@/components/vendor/fund-vendor-modal"
    import { AddVendorModal } from "@/components/vendor/add-vendor-modal"
    import { toast } from "sonner" 

    export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [fundModalOpen, setFundModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
    const [removingVendorId, setRemovingVendorId] = useState<string | null>(null)

    useEffect(() => {
        fetchVendors()
    }, [])

    const fetchVendors = async () => {
        try {
        const response = await adminApi.getVendors()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vendorsData = (response as any).vendors || response
        setVendors(Array.isArray(vendorsData) ? vendorsData : [])
        } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch vendors")
        } finally {
        setLoading(false)
        }
    }

    const filteredVendors = vendors.filter((vendor) =>
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.name && vendor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        vendor.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleFundVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor)
        setFundModalOpen(true)
    }

    const handleFundSuccess = () => {
        setFundModalOpen(false)
        setSelectedVendor(null)
        fetchVendors()
    }

    const handleAddSuccess = () => {
        setAddModalOpen(false)
        fetchVendors()
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    // ✅ Remove vendor handler
    const handleRemoveVendor = async (vendor: Vendor) => {
        const confirmDelete = confirm(
        `Are you sure you want to remove vendor "${vendor.name || vendor.email}"? This action cannot be undone.`
        )
        if (!confirmDelete) return

        try {
        setRemovingVendorId(vendor.id)
        await adminApi.removeVendor(vendor.id)
        toast.success(`Vendor "${vendor.name}" removed successfully`)
        setVendors((prev) => prev.filter((v) => v.id !== vendor.id))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
        toast.error(err.message || "Failed to remove vendor")
        } finally {
        setRemovingVendorId(null)
        }
    }

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        )
    }

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Sub-Vendors</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all vendor accounts</p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
            </Button>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            </div>
        )}

        <Card>
            <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Vendors</CardTitle>
                <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                />
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>WALLET BALANCE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredVendors.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {vendors.length === 0
                        ? "No vendors found. Add your first vendor to get started."
                        : "No vendors match your search."}
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                        <TableCell className="font-medium">
                        {vendor.name || `Vendor ${vendor.id.slice(-6)}`}
                        </TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>GHS{vendor.balance?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                        <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFundVendor(vendor)}
                        >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Fund
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveVendor(vendor)}
                            disabled={removingVendorId === vendor.id}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {removingVendorId === vendor.id ? "Removing..." : "Remove"}
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div>
                Showing 1 to {filteredVendors.length} of {vendors.length} entries
                </div>
            </div>
            </CardContent>
        </Card>

        <FundVendorModal
            open={fundModalOpen}
            onOpenChange={setFundModalOpen}
            vendor={selectedVendor}
            onSuccess={handleFundSuccess}
        />

        <AddVendorModal
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
            onSuccess={handleAddSuccess}
        />
        </div>
    )
    }
