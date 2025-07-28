"use client";

import MapSelector from "@/components/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NewPost() {
    return (
        <div className="max-w-lg mx-auto mt-10 flex flex-col gap-8">
            <MapSelector />
            <Card>
                <CardHeader className="font-bold">New Post</CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4"> 
                        <div>
                            <label htmlFor="" className="block font-medium text-gray-700 mb-1">Place Name</label>
                            <input type="text" name="name" placeholder="Abbey Road..." className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                        </div>
                        <div>
                            <label htmlFor="" className="block font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" name="address" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                        </div>
                        <div>
                            <label htmlFor="" className="block font-medium text-gray-700 mb-1">My Review</label>
                            <textarea name="review" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <Button variant="customIndigo" type="submit" className="font-bold">
                            Post
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
