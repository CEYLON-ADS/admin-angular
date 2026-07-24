export interface AdvertisementSlot {
  id?: string;
  slotNumber: number;
  estimateCost: number;
  categoryId: string;
  activeState: boolean;
  availability: boolean;
}
