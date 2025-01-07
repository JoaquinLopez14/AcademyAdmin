export const calculateRanking = (couples) => {
    const categories = ['S', 'A', 'L'];
    const rankedCouples = [...couples];

    categories.forEach(category => {
        const validCouples = rankedCouples
        .filter(couple => couple.category === category && couple.average > 0 )
        .sort((a,b) => parseFloat(b.average) - parseFloat(a.average));

        validCouples.forEach((couple, index) => {
            couple.rank = index + 1
        });
    });

    return rankedCouples
}