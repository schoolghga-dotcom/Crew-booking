-- Crew Booking Platform - Database Schema for Supabase / PostgreSQL

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('specialist', 'producer', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    city TEXT DEFAULT 'Москва',
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'specialist',
    
    -- Specialist specific fields
    primary_department TEXT,
    subcategories TEXT[], -- Array of subcategories/professions
    shift_rate NUMERIC(10, 2) DEFAULT 0,
    is_open_to_creative_projects BOOLEAN DEFAULT FALSE,
    years_of_experience INT DEFAULT 1,
    projects_count INT DEFAULT 0,
    education TEXT,
    bio TEXT,
    payment_notes TEXT,
    
    -- Portfolio & Media
    showreel_url TEXT,
    gallery_urls TEXT[],
    equipment_tags TEXT[], -- e.g., ARRAY['grandMA2', 'Avolites Titan', 'Midas M32', 'Blackout']
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Departments and Subcategories Catalog
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    sort_order INT DEFAULT 0
);

CREATE TABLE public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Dynamic (Custom) Subcategories (User submitted)
CREATE TABLE public.custom_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_name TEXT NOT NULL,
    suggested_name TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Availability Calendar
CREATE TABLE public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    note TEXT,
    UNIQUE(specialist_id, date)
);

-- 6. Projects (for Producers/Companies)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location TEXT,
    start_date DATE,
    end_date DATE,
    budget NUMERIC(12, 2),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Booking Requests
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status booking_status DEFAULT 'pending',
    proposed_rate NUMERIC(10, 2),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Reviews & Ratings
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    project_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED DATA FOR DEPARTMENTS AND PROFESSIONS (From Section 4 of TZ)

INSERT INTO public.departments (name, sort_order) VALUES
('1. Операторский цех и Камера', 1),
('2. Цех Света (Светотехника)', 2),
('3. Цех Звука', 3),
('4. Продюсерский цех', 4),
('5. Режиссерский цех', 5),
('6. Художественный цех (Art Department)', 6),
('7. Костюм и Грим', 7),
('8. Сценический комплекс и Механика (Грип / Риггинг)', 8),
('9. Пост-продакшен (Монтаж и VFX)', 9);

-- RLS Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
