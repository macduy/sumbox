import type { XYSelection } from '$lib/types/selection';
import type { TargetData } from '$lib/types/target';

export type UndoStep = {
	// Selection that was removed.
	selection: XYSelection;
	// Target that was matched, if any.
	matchedTarget?: TargetData;
};
