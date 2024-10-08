// "use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const courseSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Course name must be at least 2 characters." }),
	startTime: z.string().min(5, { message: "Start time is required." }),
	endTime: z.string().min(5, { message: "End time is required." }),
	location: z
		.string()
		.min(2, { message: "Location must be at least 2 characters." }),
});

const formSchema = z.object({
	courses: z
		.array(courseSchema)
		.min(1, { message: "At least one course is required." }),
});

type FormData = z.infer<typeof formSchema>;

function FormComponent({ currentDay }: { currentDay: string }) {
	// const pathname = usePathname();
	// const currentDay = pathname.split("/")[2];
	const { toast } = useToast();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			courses: [{ name: "", startTime: "", endTime: "", location: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "courses",
	});

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const response = await axios.post("/api/courses", {
				courses: data.courses,
				day: currentDay,
			});

			console.log("response in form:::: ", response);

			if (response.status == 200) {
				toast({
					title: "Success",
					description: "Course created successfully",
				});
				form.reset();
			} else {
				console.error("Error creating course in else:", response);
			}
		} catch (error) {
			console.error("Error creating course:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="space-y-4 p-4 border rounded-md"
					>
						<h3 className="text-lg font-semibold">
							Course {index + 1}
						</h3>
						<FormField
							control={form.control}
							name={`courses.${index}.name`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Name</FormLabel>
									<FormControl>
										<Input
											placeholder="CMPUT 201"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`courses.${index}.startTime`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Time</FormLabel>
									<FormControl>
										<Input type="time" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`courses.${index}.endTime`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Time</FormLabel>
									<FormControl>
										<Input type="time" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`courses.${index}.location`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input placeholder="DICE" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{fields.length > 1 && (
							<Button
								type="button"
								variant="destructive"
								onClick={() => remove(index)}
							>
								<Trash2 className="mr-2 h-4 w-4" /> Remove
								Course
							</Button>
						)}
					</div>
				))}
				<Button
					type="button"
					variant="outline"
					onClick={() =>
						append({
							name: "",
							startTime: "",
							endTime: "",
							location: "",
						})
					}
				>
					<PlusCircle className="mr-2 h-4 w-4" /> Add Another Course
				</Button>
				<Button type="submit" className="ml-2">
					Submit All Courses
				</Button>
				<Link href={`/d/${currentDay}/paths`} className="mx-2">
					<Button>Show Paths</Button>
				</Link>
			</form>
		</Form>
	);
}

export default FormComponent;
