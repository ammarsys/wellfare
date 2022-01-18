import styled from "styled-components";
import Link from "next/link";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useEffect } from "react";

interface PfpProps {
  url: string;
}

const Pfp: React.FC<PfpProps> = ({ url }) => {
  const PfpEl = styled.div`
    width: 4em;
    height: 4em;
    border-radius: 100%;
    cursor: pointer;
    background-image: url(${url});
    background-size: cover;
    background-repeat: no-repeat;
  `;

  return (
    <div className="pfp">
      <Link href="/app/user">
        <PfpEl></PfpEl>
      </Link>
    </div>
  );
};

const UserPfp: React.FC = () => {
  const { pfp } = useTypedSelector((state) => state.user).info;

  useEffect(() => {
    console.log(pfp);
  }, [pfp]);
  return <Pfp url={pfp} />;
};

export default Pfp;
export { UserPfp };
