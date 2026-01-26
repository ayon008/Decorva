import FirstForm from '../Form/FirstForm';
import SecondForm from '../Form/SecondForm';
import ThirdForm from '../Form/ThirdForm';
import ForthForm from '../Form/ForthForm';
import { User } from "@prisma/client";

const Information = ({ data }: { data: User }) => {
    return (
        <div className='flex flex-col gap-4'>
            <h2 className={`product-title mb-0!`}>User information</h2>
            <p>
                Here you can enter or edit public information about yourself. The data will be used in the future for ordering. The changes you make will be displayed immediately after saving.
            </p>
            <div className='flex flex-col gap-6'>
                <FirstForm data={data} />
                <SecondForm data={data} />
                <ThirdForm data={data} />
                <ForthForm data={data} />
            </div>
        </div>
    )
}

export default Information;