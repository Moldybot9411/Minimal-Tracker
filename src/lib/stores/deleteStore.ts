import { TrackerService } from "$lib/trackerService";
import { get, writable } from "svelte/store";

type DeleteDialogState = {
	open: boolean;
	itemId?: number;
};

function createDeleteDialogStore() {
	const { subscribe, set, update } = writable<DeleteDialogState>({
		open: false,
	});

	return {
		subscribe,

		open: (itemId: number) => {
			set({
				open: true,
				itemId,
			});
		},

		close: () => set({ open: false }),

		async confirm() {
			const state: DeleteDialogState = get({ subscribe });
			
            if (!state.itemId) return;

            await TrackerService.remove(state.itemId);

            set({ open: false });
		},
	};
}

export const deleteDialog = createDeleteDialogStore();