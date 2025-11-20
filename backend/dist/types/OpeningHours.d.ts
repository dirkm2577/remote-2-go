export interface DayHours {
    isOpen: boolean;
    openTime: string | null;
    closeTime: string | null;
}
export interface OpeningHours {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
    specialNotes?: string | null;
}
export interface PlaceOpeningHours {
    openingHours: OpeningHours | null;
    lastVerifiedAt: string | null;
}
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export declare const DAYS_OF_WEEK: DayOfWeek[];
export declare const DAY_LABELS: {
    readonly monday: "Monday";
    readonly tuesday: "Tuesday";
    readonly wednesday: "Wednesday";
    readonly thursday: "Thursday";
    readonly friday: "Friday";
    readonly saturday: "Saturday";
    readonly sunday: "Sunday";
};
export declare const createEmptyOpeningHours: () => OpeningHours;
export declare const isCurrentlyOpen: (openingHours: OpeningHours | null) => boolean;
