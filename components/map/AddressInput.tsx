"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

type Props = {
    onSelectAddress: (address: string, lat: number, lng: number) => void;
    initialAddress?: string;
};

export default function AddressInput({ onSelectAddress, initialAddress }: Props) {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            const address = place.formatted_address;
            const location = place.geometry?.location;

            if (address && location) {
                const lat = location.lat();
                const lng = location.lng();
                onSelectAddress(address, lat, lng);
            }
        }
    };
    return (
        
            <Autocomplete
                onLoad={(autocomplete) =>
                    (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceChanged}
            >
                <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    defaultValue={initialAddress ?? ""}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </Autocomplete>
        
    );
}
