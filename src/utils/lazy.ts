const status = {
	cropper: false,
};

export const initializeCropper = async () => {
	if (status.cropper) return status.cropper;

	await import("cropperjs");

	status.cropper = true;
	return status.cropper;
};

export const initializeDOMPurify = async () =>
	(await import("dompurify")).default;

export const initializeSortable = async () =>
	(await import("solid-sortablejs")).default;
