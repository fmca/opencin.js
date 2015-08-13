from __future__ import print_function
import json

def js_menu_funcs(menu_name, query, next_menu):
    if query:
        arg_template = "%%%"
        query_parametrized = '\"+arg+\"'.join(query.split(arg_template))
        arg_param = 'arg,' if arg_template in query else ''
        return 'function get_%s(%scallback){ query("%s", "json" , callback, alert); }\n' % (menu_name, arg_param, query_parametrized)
    else:
        return ''

def print_menu_tree(menu_name, menu_structure, tab=1):

    #print('-' * tab + menu_name)
    next_menu = menu_structure['query']['results']['menuMatch']
    sparql = menu_structure['query']['sparql']

    menu_funcs = js_menu_funcs(menu_name, sparql, None)
    if 'categories' in menu_structure:
        categories = menu_structure['categories']
        for c_name, c_struct in categories.items():
            menu_funcs += print_menu_tree(c_name, c_struct, tab + 1)

    return menu_funcs

def main():
    with open('structure.json') as json_file:
        structure = json.load(json_file)
        all_menu_funcs = print_menu_tree('home', structure['home'])

        with open('template.js') as template:
            header = template.read()
            import jsbeautifier
            script = jsbeautifier.beautify(header + all_menu_funcs)
            with open('../opencin.js', 'w') as result_file:
                result_file.write(script)


if __name__ == '__main__':
    main()
