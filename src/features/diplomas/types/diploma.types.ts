export interface Diploma {
    id: string;
    title: string;
    description: string;
    image: string;
    immutable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DiplomaDetailsResponse {
    diploma: Diploma;
}
