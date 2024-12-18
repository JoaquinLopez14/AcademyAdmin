export const calculateRanking = (couples) => {
    const categories = ['S', 'A', 'L'];
    const rankedCouples = [];

    categories.forEach(category => {
        const validCouples = couples
        .filter(couple => couple.category === category && couple.average > 0 )
        .sort((a, b) => b.average - a.average);


        validCouples.forEach((couple, index) => {
            couple.rank = index + 1
        });

        rankedCouples.push(...validCouples)
    });

    return rankedCouples
}