import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Slider} from "@/components/ui/slider";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useToast} from "@/hooks/use-toast";
import {ArrowLeft, Calendar, Coins, Info, Wallet} from "lucide-react";
import {LocationPicker} from "@/components/LocationPicker";
import {useTranslation} from "react-i18next";
import {useCreateBottleListing} from "@/hooks/api";

const CreateListing = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user} = useAuth();
    const {toast} = useToast();
    const createListingMutation = useCreateBottleListing();

    const [formData, setFormData] = useState({
        title: "",
        bottleCount: "",
        locationAddress: "",
        description: "",
        latitude: 0,
        longitude: 0,
        pickupDeadline: "",
    });

    const [hasLocation, setHasLocation] = useState(false);
    const [splitPercentage, setSplitPercentage] = useState(50);

    // Auto-calculate estimated refund (bottles × 50 HUF)
    const bottleCount = parseInt(formData.bottleCount) || 0;
    const estimatedRefund = bottleCount * 50;
    const yourShare = Math.round((estimatedRefund * splitPercentage) / 100);
    const volunteerShare = estimatedRefund - yourShare;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleLocationSelect = (location: {
        address: string;
        latitude: number;
        longitude: number;
    }) => {
        setFormData((prev) => ({
            ...prev,
            locationAddress: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
        }));
        setHasLocation(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: t('auth.authenticationRequired'),
                description: t('auth.pleaseSignIn'),
                variant: "destructive",
            });
            navigate("/auth");
            return;
        }

        if (!hasLocation || !formData.locationAddress) {
            toast({
                title: t('listing.locationRequired'),
                description: t('listing.pleaseSelectLocation'),
                variant: "destructive",
            });
            return;
        }

        const requestBody = {
            bottleCount,
            locationAddress: formData.locationAddress,
            estimatedRefund,
            splitPercentage,
            title: formData.title || undefined,
            description: formData.description || undefined,
            latitude: hasLocation ? formData.latitude : undefined,
            longitude: hasLocation ? formData.longitude : undefined,
            pickupDeadline: formData.pickupDeadline ? new Date(formData.pickupDeadline).toISOString() : undefined,
        };

        createListingMutation.mutate(requestBody, {
            onSuccess: () => {
                navigate("/");
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={() => navigate("/")}>
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            {t('common.backToHome')}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <Card className="border-green-200">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('listing.createPageTitle')}</CardTitle>
                        <CardDescription>
                            {t('listing.createPageSubtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('listing.titleOptional')}</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder={t('listing.titlePlaceholder2')}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    maxLength={200}
                                />
                            </div>

                            {/* Bottle Count (Required) */}
                            <div className="space-y-2">
                                <Label htmlFor="bottleCount">
                                    {t('listing.bottleCountRequired')}
                                </Label>
                                <Input
                                    id="bottleCount"
                                    name="bottleCount"
                                    type="number"
                                    placeholder={t('listing.bottleCountPlaceholder2')}
                                    value={formData.bottleCount}
                                    onChange={handleInputChange}
                                    required
                                    min={1}
                                    max={10000}
                                />
                            </div>

                            {/* Location Picker (Required) */}
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialLocation={
                                    hasLocation
                                        ? {
                                            address: formData.locationAddress,
                                            latitude: formData.latitude,
                                            longitude: formData.longitude,
                                        }
                                        : undefined
                                }
                            />

                            {/* Description (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('listing.description')}</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder={t('listing.descriptionPlaceholder')}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    maxLength={1000}
                                    rows={4}
                                />
                            </div>

                            {/* How It Works Information */}
                            <Alert className="bg-blue-50 border-blue-200">
                                <Info className="h-4 w-4 text-blue-600"/>
                                <AlertDescription className="text-sm text-blue-900">
                                    <strong>{t('listing.howPaymentWorks')}</strong> {t('listing.paymentExplanation')}
                                </AlertDescription>
                            </Alert>

                            {/* Estimated Refund (Auto-calculated) */}
                            <div className="space-y-2">
                                <Label>
                                    <Coins className="w-4 h-4 inline mr-1"/>
                                    {t('listing.totalBottleRefund')}
                                </Label>
                                <Card className="bg-gray-50 border-gray-200">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-baseline justify-between">
                                            <div>
                                                <p className="text-3xl font-bold text-gray-900">{estimatedRefund} HUF</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {t('listing.autoCalculated')}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                        {t('listing.bottlesPerHuf', {count: bottleCount})}
                      </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Split Percentage Slider */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>
                                        <Wallet className="w-4 h-4 inline mr-1"/>
                                        {t('listing.splitPercentageWithValue', {value: splitPercentage})}
                                    </Label>
                                    <Slider
                                        value={[splitPercentage]}
                                        onValueChange={(value) => setSplitPercentage(value[0])}
                                        min={0}
                                        max={100}
                                        step={5}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{t('listing.sliderLabels.zero')}</span>
                                        <span>{t('listing.sliderLabels.twentyFive')}</span>
                                        <span>{t('listing.sliderLabels.fifty')}</span>
                                        <span>{t('listing.sliderLabels.seventyFive')}</span>
                                        <span>{t('listing.sliderLabels.hundred')}</span>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-green-50 border-green-200">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 mb-1">{t('listing.youReceive')}</p>
                                            <p className="text-2xl font-bold text-green-700">{yourShare} HUF</p>
                                            <p className="text-xs text-gray-500 mt-1">{t('listing.ofTotal', {value: splitPercentage})}</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 mb-1">{t('listing.volunteerKeeps')}</p>
                                            <p className="text-2xl font-bold text-blue-700">{volunteerShare} HUF</p>
                                            <p className="text-xs text-gray-500 mt-1">{t('listing.ofTotal', {value: 100 - splitPercentage})}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <p className="text-xs text-center text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    {t('listing.tip')}
                                </p>
                            </div>

                            {/* Pickup Deadline (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="pickupDeadline">
                                    <Calendar className="w-4 h-4 inline mr-1"/>
                                    {t('listing.pickupDeadline')}
                                </Label>
                                <Input
                                    id="pickupDeadline"
                                    name="pickupDeadline"
                                    type="datetime-local"
                                    value={formData.pickupDeadline}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    disabled={createListingMutation.isPending}
                                >
                                    {createListingMutation.isPending ? t('listing.creatingButton') : t('listing.createButton')}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateListing;
