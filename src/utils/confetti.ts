import JSConfetti from "js-confetti";

const confetti = new JSConfetti();

export const playConfetti = (confettiConfig?: any) => {
	confetti.addConfetti({
		...(confettiConfig ?? {}),
		confettiNumber: "emojis" in (confettiConfig ?? {}) ? 40 : 200,
	});
};
