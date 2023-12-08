export const orStatement = (array: Array<string>):Array<any> => {
    const reduced = array.reduce(
        (acc: { id: string }[], el: string) => {
            acc.push({ id: el });
            return acc;
        },
        []
    );
    return reduced;
};
