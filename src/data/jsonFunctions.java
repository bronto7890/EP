package data;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.*;

import book.book;

public class jsonFunctions {
	public static String toJson(ArrayList<book> books) {
		Gson gson = new Gson();
		String jsonArray = gson.toJson(books);
		System.out.println(jsonArray);
		return jsonArray;
	}
	
	public static void fileWriter(String jsonArray) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		try {
			mapper.writeValue(new File("./src/data/data.json"), jsonArray);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
