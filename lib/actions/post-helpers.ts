import { prisma } from "../prisma";

export async function preparePostData(formData: FormData) {
    const title = formData.get("name")?.toString();
    const address = formData.get("address")?.toString();
    const dateStr = formData.get("date")?.toString();
    const content = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const lat = parseFloat(formData.get("lat")?.toString() || "0");
    const lng = parseFloat(formData.get("lng")?.toString() || "0");

    if (!title || !address) {
        throw new Error("Please enter both the place name and address.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = dateStr ? new Date(dateStr) : null;

    if (date && date.getTime() > today.getTime()) {
        throw new Error("Date is invalid.");
    }

    let location = await prisma.location.findFirst({
        where: { address },
    });

    if (!location) {
        location = await prisma.location.create({
            data: { address, lat, lng },
        });
    }

    return { title, date, content, imageUrl, locationId: location.id };
}
