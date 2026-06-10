import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User,UserDocument } from 'src/schemas/auth.schema';
import { CreateUserDto } from './dto/create-user-dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Create a new User
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async register(createUserDto:CreateUserDto){
        const userExist=await this.userModel.findOne({email:createUserDto.email})
        if(userExist){
            throw new ConflictException('User already exist')
        }
        const hashedPassword=await bcrypt.hash(createUserDto.password,10)
        const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
        await newUser.save();
        return {message:'User created successfully'}
    }
    async login(email:string,password:string){
        const user = await this.userModel.findOne({email})
        if(!user || !(await bcrypt.compare(password,user.password))){
            throw new UnauthorizedException('Invalid credentials')
        }
        const payload = {sub:user._id,email:user.email}
        const token = this.jwtService.sign(payload)
        return {access_token:token}        
    }

}
