import Image from 'next/image';
import { MUN_Team } from '@/data/MUN_Team';
import { defaultImageUrl } from '@/data/Teams';
import Title from './Title';

const TeamSection:React.FC = () => {
    return (
        <div className='py-10'>
          <Title text="Meet the Team" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:w-full gap-8 justify-items-center">
            {MUN_Team.map((member, index) => (
              <div key={index} className="group relative w-[300px]">
                {/* Member Card */}
                <div className="relative">
                  {/* Card gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl animate-gradient-x" />

                  {/* Card Content */}
                  <div className="relative m-0.5 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 backdrop-blur-xl transform hover:scale-95 transition-all duration-500">
                    {/* Spotlight effect */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex flex-col items-center gap-6">
                      {/* Profile Image */}
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full animate-gradient-x" />
                        <div className="absolute inset-0.5 bg-gray-900 rounded-full overflow-hidden">
                          <Image
                            src={member.imageLink ?? defaultImageUrl}
                            alt={`${member.name}'s photo`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 ">
                          {member.name}
                        </h3>
                        <span className="text-sm text-transparent bg-clip-text text-white ">
                          {member.position}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
}

export default TeamSection;