import { memo } from "react";
import styles from "./BulletList.module.css";

const BulletList = memo(({ data }: { data: string[] }) => {
    return (
        <ol className={styles.ol}>
            {data.map((i) => (
                <li key={i} className={styles.li}>
                    {i}
                </li>
            ))}
        </ol>
    );
});
BulletList.displayName = "BulletList";

export default BulletList;
